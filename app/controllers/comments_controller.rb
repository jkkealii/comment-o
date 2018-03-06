class CommentsController < ApplicationController
  def index
    comments = Comment.grab_comments(params[:limit])
    render json: { comments: comments }
  end

  def create
    comment = Comment.new(comment_params)
    render json: { errors: comment.errors.full_messages.join("\n") }, status: 422 unless comment.save
  end

  def update
    comment = Comment.find(params[:id])
    render json: { errors: comment.errors.full_messages.join("\n") }, status: 422 unless comment.update(comment_params)
  end

  def destroy
    comment = Comment.find(params[:id])
    render json: { errors: comment.errors.full_messages.join("\n") }, status: 422 unless comment.destroy
  end

  private

  def comment_params
    params.require(:comment).permit(:content, :ups, :downs, :oser_id, :edited)
  end
end
