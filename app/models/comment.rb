class Comment < ApplicationRecord
  belongs_to :oser
  belongs_to :parent, class_name: 'Comment'
  has_many :children, class_name: 'Comment', foreign_key: 'parent_id', dependent: :destroy

  validates :content, presence: true, length: { minimum: 1, message: 'Comment cannot be blank' }

  scope :top_level, -> { where(parent_id: nil) }
  scope :child, -> { where('parent_id IS NOT NULL') }

  def child_comments(parent_ids = [])
    comments = []
    children.includes(:oser, :children).each do |child|
      comment_data = {
        id: child.id,
        content: child.content,
        ups: child.ups,
        downs: child.downs,
        edited: child.edited,
        parent_id: child.parent_id,
        parent_ids: (parent_ids || []) << self.id,
        children_count: child.children.size,
        children: [],
        posted: {
          formatted: child.created_at.to_formatted_s(:long),
          datetime: child.created_at.strftime('%Y-%m-%dT%l:%M:%S')
        },
        updated: {
          formatted: child.updated_at.to_formatted_s(:long),
          datetime: child.updated_at.strftime('%Y-%m-%dT%l:%M:%S')
        },
        oser: {
          id: child.oser.id,
          username: child.oser.username,
          flair: child.oser.flair
        }
      }
      comments << comment_data
    end
    comments
  end

  def self.grab_comments(top_level_only = true, limit = nil, include_children = false)
    comment_records = Comment.order(created_at: :desc).includes(:oser, :children)
    comment_records = comment_records.limit(limit.to_i) if limit.present?
    comment_records = comment_records.top_level if top_level_only
    comments = []
    comment_records.each do |comment|
      comment_data = {
        id: comment.id,
        content: comment.content,
        ups: comment.ups,
        downs: comment.downs,
        edited: comment.edited,
        parent_id: comment.parent_id,
        parent_ids: [],
        children_count: comment.children.size,
        children: [],
        posted: {
          formatted: comment.created_at.to_formatted_s(:long),
          datetime: comment.created_at.strftime('%Y-%m-%dT%l:%M:%S')
        },
        updated: {
          formatted: comment.updated_at.to_formatted_s(:long),
          datetime: comment.updated_at.strftime('%Y-%m-%dT%l:%M:%S')
        },
        oser: {
          id: comment.oser.id,
          username: comment.oser.username,
          flair: comment.oser.flair
        }
      }
      comment_data[:children] = comment.child_comments if include_children
      comments << comment_data
    end
    comments
  end
end
