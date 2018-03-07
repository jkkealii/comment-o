class HomeController < ApplicationController
  layout 'application'

  def index
    @comments = Comment.grab_comments(false, 5)
    @osers = Oser.grab_osers

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

  def signup

  end

  def osers
    @osers = Oser.grab_osers
  end

  def comments
    @comments = Comment.grab_comments
    @comment_count = Comment.count
  end
end
