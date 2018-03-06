class Comment < ApplicationRecord
  belongs_to :oser

  validates :content, presence: true, length: { minimum: 1, message: 'Comment cannot be blank' }
end
