class Comment < ApplicationRecord
  belongs_to :oser

  validates :content, presence: true
end
