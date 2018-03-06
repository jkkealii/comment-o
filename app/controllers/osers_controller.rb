class OsersController < ApplicationController
  def index
    osers = Oser.grab_osers
    render json: { osers: osers }
  end

  def create
    oser = Oser.new(oser_params)
    render json: { errors: oser.errors.full_messages.join("\n") }, status: 422 unless oser.save
  end

  def update
    oser = Oser.find(params[:id])
    render json: { errors: oser.errors.full_messages.join("\n") }, status: 422 unless oser.update(oser_params)
  end

  def destroy
    oser = Oser.find(params[:id])
    render json: { errors: oser.errors.full_messages.join("\n") }, status: 422 unless oser.destroy
  end

  private

  def oser_params
    params.require(:oser).permit(:username, :flair, :password, :password_confirmation)
  end
end
