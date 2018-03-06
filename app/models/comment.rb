class Comment < ApplicationRecord
  belongs_to :oser

  validates :content, presence: true, length: { minimum: 1, message: 'Comment cannot be blank' }

  def self.grab_comments(limit = nil)
    if limit.nil?
      comment_records = Comment.order(created_at: :desc).includes(:oser)
    else
      comment_records = Comment.order(created_at: :desc).limit(limit.to_i).includes(:oser)
    end
    comments = []
    comment_records.each do |comment|
      comments << {
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
    end
    comments
  end
end
