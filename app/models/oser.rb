class Oser < ApplicationRecord
  has_many :comments, dependent: :destroy

  attr_accessor :flair
  has_secure_password
  validates :username, presence: true, length: { maximum: 36 }
  validates :password, presence: true, length: { minimum: 6 }
end
