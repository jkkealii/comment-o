class OsersController < ApplicationController
  def create
    oser = Oser.new(oser_params)
    render json: { errors: oser.errors.full_messages.join("\n") }, status: 422 unless oser.save
  end

  private

  def oser_params
    params.require(:oser).permit(:username, :flair, :password, :password_confirmation)
  end
end
