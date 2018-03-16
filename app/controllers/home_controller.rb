class HomeController < ApplicationController
  layout 'application'

  def index
    children_populated = params[:children_populated].present? ? params[:children_populated].split(',').map(&:to_i) : []
    @comments = Comment.grab_comments(true, 5, children_populated)
    @comment_count = Comment.all.size
    @osers = Oser.grab_osers(false)

    respond_to do |format|
      format.html
      format.json {
        render json: {
          comments: @comments,
          osers: @osers
        }
      }
    end
  end

  def osers
    @osers = Oser.grab_osers(false)
    @oser_count = Oser.count
  end

  def comments
    @comments = Comment.grab_comments
    @comment_count = Comment.all.size
  end
end
