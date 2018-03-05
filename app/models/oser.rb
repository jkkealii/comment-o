class Oser < ApplicationRecord
  has_many :comments, dependent: :destroy

  has_secure_password
  validates :username, presence: true, length: { maximum: 36, message: 'Osername cannot be more than 36 characters' }, uniqueness: true
  validates :password, length: { minimum: 6, message: 'Password must be a minimum of 6 characters' }, allow_nil: true, if: :password
end
