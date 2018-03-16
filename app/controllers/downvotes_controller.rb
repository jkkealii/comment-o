class DownvotesController < ApplicationController
  def create
    downvote = Downvote.new(downvote_params)
    if downvote.save
      render json: { oser: current_oser_data }
    else
      render json: { errors: downvote.errors.full_messages.join("\n") }, status: 422
    end
  end

  def destroy
    downvote = Downvote.where(oser_id: params[:downvote][:oser_id], comment_id: params[:downvote][:comment_id]).first
    if downvote.destroy
      render json: { oser: current_oser_data }
    else
      render json: { errors: downvote.errors.full_messages.join("\n") }, status: 422
    end
  end

  private

  def downvote_params
    params.require(:downvote).permit(:oser_id, :comment_id)
  end
end
