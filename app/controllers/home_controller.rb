class HomeController < ApplicationController
  def index
    @comments = Comment.all.to_json(only: [:content, :ups, :downs, :id], include: { oser: :username })
    @osers = Oser.all.to_json(only: [:username, :id])
  end
end
