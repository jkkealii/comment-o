module SessionsHelper
  def log_in(oser)
    session[:oser_id] = oser.id
  end

  def current_oser
    @current_oser ||= Oser.find_by(id: session[:oser_id])
  end

  def current_oser_data
    return nil unless logged_in?
    data = current_oser.as_json(only: [:id, :flair, :username, :role])
    data['upvoted_comment_ids'] = current_oser.upvotes.pluck(:comment_id)
    data['downvoted_comment_ids'] = current_oser.downvotes.pluck(:comment_id)
    data
  end

  def logged_in?
    !current_oser.nil?
  end

  def log_out
    session.delete(:oser_id)
    @current_oser = nil
  end
end
