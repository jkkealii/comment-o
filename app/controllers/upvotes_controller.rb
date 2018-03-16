class UpvotesController < ApplicationController
  def create
    upvote = Upvote.new(upvote_params)
    if upvote.save
      render json: { oser: current_oser_data }
    else
      render json: { errors: upvote.errors.full_messages.join("\n") }, status: 422
    end
  end

  def destroy
    upvote = Upvote.where(oser_id: params[:upvote][:oser_id], comment_id: params[:upvote][:comment_id]).first
    if upvote.destroy
      render json: { oser: current_oser_data }
    else
      render json: { errors: upvote.errors.full_messages.join("\n") }, status: 422
    end
  end

  private

  def upvote_params
    params.require(:upvote).permit(:oser_id, :comment_id)
  end
end
