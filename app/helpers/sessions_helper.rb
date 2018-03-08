module SessionsHelper
  def log_in(oser)
    session[:oser_id] = oser.id
  end

  def current_oser
    @current_oser ||= Oser.find_by(id: session[:oser_id])
  end

  def logged_in?
    !current_oser.nil?
  end

  def log_out
    session.delete(:oser_id)
    @current_oser = nil
  end
end
