class CommentsController < ApplicationController
  def index
    comments = []
    Comment.order(created_at: :desc).includes(:oser).each do |comment|
      comments << {
        id: comment.id,
        content: comment.content,
        ups: comment.ups,
        downs: comment.downs,
        edited: comment.edited,
        posted: {
          formatted: comment.created_at.to_formatted_s(:long),
          datetime: comment.created_at.strftime('%Y-%m-%dT%l:%M:%S')
        },
        updated: {
          formatted: comment.updated_at.to_formatted_s(:long),
          datetime: comment.updated_at.strftime('%Y-%m-%dT%l:%M:%S')
        },
        oser: {
          id: comment.oser.id,
          username: comment.oser.username,
          flair: comment.oser.flair
        }
      }
    end
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
