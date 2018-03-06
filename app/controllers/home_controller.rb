class HomeController < ApplicationController
  layout 'application'

  def index
    @comments = Comment.grab_comments(5)
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

  def osers_page
    @osers = Oser.grab_osers
  end

  def comments_page
    @comments = Comment.grab_comments
  end
end
