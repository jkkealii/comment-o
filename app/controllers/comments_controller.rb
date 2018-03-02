class CommentsController < ApplicationController
  def create
    comment = Comment.new(comment_params)
    render json: { errors: comment.errors.full_messages.join("\n") }, status: 422 unless comment.save
  end

  private

  def comment_params
    params.require(:comment).permit(:content, :ups, :downs, :author_id)
  end
end
