class HomeController < ApplicationController
  def index
    @comments = Comment.order(created_at: :desc).all.to_json(only: [:content, :ups, :downs, :id], include: { oser: :username })
    @osers = []
    Oser.order(created_at: :desc).pluck(:username, :id, :flair, :created_at).each do |username, id, flair, created_at|
      @osers << {
        username: username,
        id: id,
        flair: flair,
        joined: created_at.to_formatted_s(:long)
      }
    end
  end
end
