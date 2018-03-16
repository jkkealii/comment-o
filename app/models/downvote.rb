class Downvote < ApplicationRecord
  belongs_to :oser
  belongs_to :comment

  after_save :destroy_upvote

  private

  def destroy_upvote
    upvote = Upvote.where(oser_id: self.oser_id, comment_id: self.comment_id).first
    upvote.destroy unless upvote.nil?
  end
end
