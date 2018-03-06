class Comment < ApplicationRecord
  belongs_to :oser
  belongs_to :parent, class_name: 'Comment'
  has_many :children, class_name: 'Comment', foreign_key: 'parent_id'

  validates :content, presence: true, length: { minimum: 1, message: 'Comment cannot be blank' }

  def child_comments
    comments = []
    children.includes(:oser, :children).each do |child|
      comment_data = {
        id: child.id,
        content: child.content,
        ups: child.ups,
        downs: child.downs,
        edited: child.edited,
        children: child.child_comments,
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

  def self.grab_comments(limit = nil, include_children = false)
    if limit.nil?
      comment_records = Comment.order(created_at: :desc).includes(:oser, :children)
    else
      comment_records = Comment.order(created_at: :desc).limit(limit.to_i).includes(:oser, :children)
    end
    comments = []
    comment_records.each do |comment|
      comment_data = {
        id: comment.id,
        content: comment.content,
        ups: comment.ups,
        downs: comment.downs,
        edited: comment.edited,
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
