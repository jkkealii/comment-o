class CommentsController < ApplicationController
  def index
    children_populated_ids = params[:children_populated].nil? ? [] : params[:children_populated].split(',').map(&:to_i)
    comments = Comment.grab_comments((params[:top_level] || true), params[:limit], children_populated_ids)
    render json: { comments: comments, comment_count: Comment.count }
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
    comment = Comment.find(params[:id])
    children = comment.child_comments
    parent_ids = children.first[:parent_ids]
    render json: { children: children, parent_ids: parent_ids }
  end

  private

  def comment_params
    params.require(:comment).permit(:content, :ups, :downs, :oser_id, :edited, :parent_id)
  end
end
