class SessionsController < ApplicationController
  def new
    redirect_to root_url if logged_in?
  end

  def create
    oser = Oser.find_by(username: params[:session][:username])
    if oser && oser.authenticate(params[:session][:password])
      log_in(oser)
    else
      render json: { errors: 'Invalid osername/password combination.' }, status: 401
    end
  end

  def destroy
    log_out
    redirect_to root_url
  end
end
