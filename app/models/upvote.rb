class Upvote < ApplicationRecord
  belongs_to :oser
  belongs_to :comment

  after_save :destroy_downvote

  private

  def destroy_downvote
    downvote = Downvote.where(oser_id: self.oser_id, comment_id: self.comment_id).first
    downvote.destroy unless downvote.nil?
  end
end
