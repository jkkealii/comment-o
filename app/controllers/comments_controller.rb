class CommentsController < ApplicationController
  def index
    children_populated_ids = params[:children_populated].nil? ? [] : params[:children_populated].split(',').map(&:to_i)
    comments = Comment.grab_comments((params[:top_level] || true), params[:limit], children_populated_ids)
    render json: { comments: comments, comment_count: Comment.all.size }
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
    ancestor_ids = children.first[:ancestor_ids]
    render json: { children: children, ancestor_ids: ancestor_ids }
  end

  def search
    query = params[:query].presence || '*'
    fields = params[:fields].present? ? params[:fields].split(',').map(&:to_sym) : []
    comments = Comment.search_and_format(query, fields)
    render json: { comments: comments }
  end

  private

  def comment_params
    params.require(:comment).permit(:content, :oser_id, :edited, :parent_id)
  end
end
