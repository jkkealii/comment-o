class OsersController < ApplicationController
  def index
    osers = []
    Oser.order(created_at: :desc).pluck(:username, :id, :flair, :created_at).each do |username, id, flair, created_at|
      osers << {
        username: username,
        id: id,
        flair: flair,
        joined: created_at.to_formatted_s(:long)
      }
    end
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
