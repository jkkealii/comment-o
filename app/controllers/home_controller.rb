class HomeController < ApplicationController
  def index
    @comments = Comment.all.to_json(only: [:content, :ups, :downs], include: { oser: :username })
    @osers = Oser.all.to_json(only: :username)
  end
end
