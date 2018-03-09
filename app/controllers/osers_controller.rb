class OsersController < ApplicationController
  def index
    osers = Oser.grab_osers
    render json: { osers: osers }
  end

  def create
    oser = Oser.new(oser_params)
    render json: { errors: oser.errors.full_messages.join("\n") }, status: 422 unless oser.save
    log_in oser if params[:admin].nil?
  end

  def show
    oser = Oser.includes(:comments).find(params[:id])
    logged_in = logged_in? && current_oser.id == oser.id
    @oser = {
      id: oser.id,
      username: oser.username,
      flair: oser.flair,
      joined: {
        formatted: oser.created_at.to_formatted_s(:long),
        datetime: oser.created_at.strftime('%Y-%m-%dT%l:%M:%S')
      },
      logged_in: logged_in,
      comments: oser.grab_comments,
      replies: oser.grab_replies
    }
  end

  def update
    oser = Oser.find(params[:id])
    render json: { errors: oser.errors.full_messages.join("\n") }, status: 422 unless oser.update(oser_params)
  end

  def destroy
    oser = Oser.find(params[:id])
    render json: { errors: oser.errors.full_messages.join("\n") }, status: 422 unless oser.destroy
  end

  def signup
    redirect_to root_url if logged_in?
  end

  private

  def oser_params
    params.require(:oser).permit(:username, :flair, :password, :password_confirmation)
  end
end
