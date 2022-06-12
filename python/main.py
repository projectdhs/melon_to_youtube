#!/usr/bin/python
pl_name='Real 2022년 6월 1주차 멜론 Top 100'
pl_description='220530 ~ 220605 Top 100'
nodeServerIp = "localhost:8888"
myfile = "C:/melon_list.txt"

# Copyright 2011-2018 Adam Goforth
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

import logging
import os.path
import time
from datetime import datetime

import requests
import sys

import youtubeSearcher as yt

class YoutubeAdapter(object):
    def add_video_to_playlist(self, pl_id, video_id):
        requests.get("http://"+nodeServerIp+"/youtube/addToPlaylist/"+pl_id+"/"+video_id)

    def create_new_playlist(self, title, description):
        resp = requests.get("http://"+nodeServerIp+"/youtube/createPlaylist/"+title+"/"+description)

        pl_id = resp.text
        return pl_id



class PlaylistCreator(object):
    def __init__(self, logger, youtube):
        self.logger = logger
        self.youtube = youtube


    def add_first_video_to_playlist(self, pl_id, search_query):
        video_id = yt.get_video_id_for_search(search_query)

        # No search results were found, so log a message and return
        if video_id is None:
            self.logger.warning("No search results found for '%s'. "
                                "Moving on to the next song.", search_query)
            return
        
        self.youtube.add_video_to_playlist(pl_id, video_id)
    def add_chart_entries_to_playlist_new(self, pl_id, entries):
        song_count = 0
        for entry in entries:
            song_count += 1
            if song_count > 100:
                break

            query = entry + ' lyrics'


            print("adding - " + entry)
            self.add_first_video_to_playlist(pl_id, query)

        self.logger.info("\n---\n")

    def add_videos(self, mchart):
        pl_id = self.youtube.create_new_playlist(pl_name, pl_description)
        self.add_chart_entries_to_playlist_new(pl_id, mchart)


def main():
    logging.basicConfig(format='%(message)s')
    logger = logging.getLogger('melonToYTplaylist')
    logger.setLevel(logging.INFO)

    youtube = YoutubeAdapter()

    playlist_creator = PlaylistCreator(logger, youtube)
    file = open(myfile,'r',encoding='utf-8')
    text = file.read()
    file.close()

    ss = text.split('\n')

    playlist_creator.add_videos(ss)

    sys.exit()

if __name__ == '__main__':
    main()
