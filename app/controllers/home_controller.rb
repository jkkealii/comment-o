class HomeController < ApplicationController
  layout 'application'

  def index
    @comments = Comment.grab_comments(true, 5)
    @comment_count = Comment.count
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
    @osers = Oser.grab_osers
  end

  def comments
    @comments = Comment.grab_comments
    @comment_count = Comment.count
  end
end
