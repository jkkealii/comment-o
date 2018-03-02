class Comment < ApplicationRecord
  belongs_to :oser

  attr_accessor :content
  validates :content, presence: true
end
