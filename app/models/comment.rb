class Comment < ApplicationRecord
  acts_as_nested_set
  searchkick text_middle: [:osername, :content]

  belongs_to :oser, counter_cache: true
  belongs_to :parent, class_name: 'Comment', counter_cache: :children_count
  has_many :children, class_name: 'Comment', foreign_key: 'parent_id', dependent: :destroy
  has_many :upvotes
  has_many :upvote_osers, through: :upvotes, dependent: :destroy
  has_many :downvotes
  has_many :downvote_osers, through: :downvotes, dependent: :destroy

  validates :content, presence: true, length: { minimum: 1, too_short: 'Comment cannot be blank', maximum: 180, too_long: "Comment exceeds maximum length of %{count} characters" }

  default_scope { # call `unscoped` if not desired
    select <<~SQL
      comments.*,
      (
        SELECT COUNT(upvotes.id) FROM upvotes
        WHERE comment_id = comments.id
      ) AS upvotes_count
      ,
      (
        SELECT COUNT(downvotes.id) FROM downvotes
        WHERE comment_id = comments.id
      ) AS downvotes_count
    SQL
  }

  scope :children, -> { where('parent_id IS NOT NULL') }
  scope :search_import, -> { includes(:oser) } # Used for searchkick gem; eager loading on indexing

  def all_ancestor_ids
    ancestors.pluck(:id)
  end

  def hashed
    # Must be called by a comment loaded with default scope
    {
      id: self.id,
      content: self.content,
      upvotes: upvotes_count,
      downvotes: downvotes_count,
      edited: self.edited,
      parent_id: self.parent_id,
      ancestor_ids: child? ? all_ancestor_ids : [],
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
        flair: self.oser.flair,
        flair_color: self.oser.flair_color
      }
    }
  end

  def child_comments(children_populated_ids = children.pluck(:id))
    comments = []
    offspring = self.descendants.includes(:oser)
    Comment.each_with_level(offspring.where(id: children_populated_ids).or(offspring.where(parent_id: children_populated_ids))) do |child, level|
      next unless level == 1
      comment_data = child.hashed
      comment_data[:children] = child.child_comments(children_populated_ids) if children_populated_ids.include?(child.id)
      comments << comment_data
    end
    comments
  end

  # Used for searchkick gem. Run Comment.reindex after changing
  def search_data
    {
      osername: self.oser.username,
      content: self.content
    }
  end

  def self.search_and_format(query, fields = [])
    results = []
    if query.present? && fields.present?
      results = Comment.search(query, includes: [:oser], fields: fields, match: :text_middle)
    elsif query.present?
      results = Comment.search(query, includes: [:oser], match: :text_middle)
    end
    # Weird map call here because results is a Searchkick::Results object
    results.map { |c| c }.keep_if(&:root?).map(&:hashed)
  end

  def self.grab_comments(top_level_only = true, limit = nil, children_populated_ids = [])
    comment_records = Comment.includes(:oser)
    comment_records = comment_records.limit(limit.to_i) if limit.present?
    comment_records = comment_records.roots if top_level_only
    comments = []
    comment_records.each do |comment|
      comment_data = comment.hashed
      comment_data[:children] = comment.child_comments(children_populated_ids) if children_populated_ids.include?(comment.id)
      comments << comment_data
    end
    comments.sort! { |one, two| two[:id] <=> one[:id] }
  end
end
