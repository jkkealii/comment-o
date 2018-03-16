class Oser < ApplicationRecord
  has_many :comments, dependent: :destroy
  has_many :upvotes
  has_many :upvoted_comments, through: :upvotes, dependent: :destroy
  has_many :downvotes
  has_many :downvoted_comments, through: :downvotes, dependent: :destroy

  has_secure_password
  searchkick word_start: [:osername, :flair]
  validates :flair, length: { maximum: 17, message: 'Flair must be kept under 17 characters' }
  validates :flair_color, length: { is: 7 }, css_hex_color: true, if: :flair_color
  validates :username, presence: true, length: { maximum: 36, message: 'Osername cannot be more than 36 characters' }, uniqueness: true
  validates :password, length: { minimum: 6, message: 'Password must be a minimum of 6 characters' }, allow_nil: true, if: :password

  scope :admin, -> { where(role: Roles::ADMIN) }
  scope :oser_role, -> { where(role: Roles::OSER) }

  module Roles
    ALL = [
      ADMIN = 'admin'.freeze,
      OSER = 'oser'.freeze
    ].freeze
  end

  def hashed(include_comments = false, children_populated_ids = [])
    {
      id: self.id,
      username: self.username,
      flair: self.flair,
      flair_color: self.flair_color,
      joined: {
        formatted: self.created_at.to_formatted_s(:long),
        datetime: self.created_at.strftime('%Y-%m-%dT%l:%M:%S')
      },
      comments_count: self.comments.size,
      comments: include_comments ? self.grab_comments(children_populated_ids) : [],
      # replies: include_comments ? self.grab_replies : nil
      replies: nil # no use case yet
    }
  end

  def grab_comments(children_populated_ids = [])
    comments = []
    self.comments.roots.each do |comment|
      hashed_comment = comment.hashed
      hashed_comment[:children] = comment.child_comments(children_populated_ids) if children_populated_ids.include?(comment.id)
      comments << hashed_comment
    end
    comments
  end

  def grab_replies
    replies = []
    self.comments.children.each do |reply|
      replies << reply.hashed
    end
    replies
  end

  # Used for searchkick gem. Run Oser.reindex after changing
  def search_data
    {
      osername: username,
      flair: flair
    }
  end

  def self.search_and_format(query, fields = [])
    results = []
    if query.present? && fields.present?
      results = Oser.search(query, fields: fields, match: :word_start)
    elsif query.present?
      results = Oser.search(query, match: :word_start)
    end
    results.map(&:hashed)
  end

  def self.grab_osers(include_comments = false, expanded_osers = [], children_populated_ids = [])
    osers = []
    Oser.order(created_at: :desc).each do |oser|
      oser_data = oser.hashed(include_comments && expanded_osers.include?(oser.id), children_populated_ids)
      osers << oser_data
    end
    osers
  end
end
