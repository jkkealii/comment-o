class Comment < ApplicationRecord
  acts_as_nested_set
  belongs_to :oser
  belongs_to :parent, class_name: 'Comment', counter_cache: :children_count
  has_many :children, class_name: 'Comment', foreign_key: 'parent_id', dependent: :destroy

  validates :content, presence: true, length: { minimum: 1, message: 'Comment cannot be blank' }

  scope :children, -> { where('parent_id IS NOT NULL') }

  def all_parent_ids
    ancestors.pluck(:id)
  end

  def hashed
    {
      id: self.id,
      content: self.content,
      ups: self.ups,
      downs: self.downs,
      edited: self.edited,
      parent_id: self.parent_id,
      parent_ids: all_parent_ids,
      children_count: self.children.size,
      children: [],
      posted: {
        formatted: self.created_at.to_formatted_s(:long),
        datetime: self.created_at.strftime('%Y-%m-%dT%l:%M:%S')
      },
      updated: {
        formatted: self.updated_at.to_formatted_s(:long),
        datetime: self.updated_at.strftime('%Y-%m-%dT%l:%M:%S')
      },
      oser: {
        id: self.oser.id,
        username: self.oser.username,
        flair: self.oser.flair
      }
    }
  end

  def child_comments(children_populated_ids = [])
    comments = []
    children.includes(:oser).each do |child|
      comment_data = child.hashed
      comment_data[:children] = child.child_comments(children_populated_ids) if children_populated_ids.include?(child.id.to_s)
      comments << comment_data
    end
    comments
  end

  def self.grab_comments(top_level_only = true, limit = nil, children_populated_ids = [])
    comment_records = Comment.order(created_at: :desc).includes(:oser)
    comment_records = comment_records.limit(limit.to_i) if limit.present?
    comment_records = comment_records.roots if top_level_only
    comments = []
    comment_records.each do |comment|
      comment_data = comment.hashed
      comment_data[:children] = comment.child_comments(children_populated_ids) if children_populated_ids.include?(comment.id.to_s)
      comments << comment_data
    end
    comments
  end
end
