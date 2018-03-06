class Oser < ApplicationRecord
  has_many :comments, dependent: :destroy

  has_secure_password
  validates :username, presence: true, length: { maximum: 36, message: 'Osername cannot be more than 36 characters' }, uniqueness: true
  validates :password, length: { minimum: 6, message: 'Password must be a minimum of 6 characters' }, allow_nil: true, if: :password

  def self.grab_osers
    osers = []
    Oser.order(created_at: :desc).includes(:comments).each do |oser|
      oser_data = {
        username: oser.username,
        id: oser.id,
        flair: oser.flair,
        joined: oser.created_at.to_formatted_s(:long),
        comments: []
      }
      oser.comments.each do |comment|
        oser_data[:comments] << {
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
          }
        }
      end
      osers << oser_data
    end
    osers
  end
end
