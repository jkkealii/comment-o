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

  def children
    children = Comment.find(params[:id]).child_comments(params[:parent_ids])
    parent_ids = children.first[:parent_ids]
    render json: { children: children, parent_ids: parent_ids }
  end

  private

  def comment_params
    params.require(:comment).permit(:content, :ups, :downs, :oser_id, :edited, :parent_id)
  end
end
