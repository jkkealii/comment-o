class OsersController < ApplicationController
  def index
    osers = Oser.grab_osers(false)
    render json: { osers: osers }
  end

  def create
    oser = Oser.new(oser_params)
    render json: { errors: oser.errors.full_messages.join("\n") }, status: 422 unless oser.save
    log_in oser if params[:admin].nil?
  end

  def show
    oser = Oser.find(params[:id])
    logged_in = logged_in? && current_oser.id == oser.id
    @oser = oser.hashed(true)
    @oser[:logged_in] = logged_in
    respond_to do |format|
      format.html
      format.json {
        render json: {
          oser: @oser
        }
      }
    end
  end

  def update
    oser = Oser.find(params[:id])
    render json: { errors: oser.errors.full_messages.join("\n") }, status: 422 unless oser.update(oser_params)
  end

  def destroy
    oser = Oser.find(params[:id])
    render json: { errors: oser.errors.full_messages.join("\n") }, status: 422 unless oser.destroy
  end

  def search
    query = params[:query].presence || '*'
    fields = params[:fields].present? ? params[:fields].split(',').map(&:to_sym) : []
    osers = Oser.search_and_format(query, fields)
    render json: { osers: osers }
  end

  def comments
    oser = Oser.find(params[:id]).hashed(true)
    render json: { oser: oser }
  end

  def signup
    redirect_to root_url if logged_in?
  end

  private

  def oser_params
    params.require(:oser).permit(:username, :flair, :flair_color, :password, :password_confirmation)
  end
end
