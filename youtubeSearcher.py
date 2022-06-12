import requests
from bs4 import BeautifulSoup


def get_video_id_for_search(query):
#video id를 리턴하는 함수

    try:
        url = "https://www.youtube.com/results?search_query=" + query
        headers = {
                    "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 OPR/67.0.3575.115', 'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9'}
        resp = requests.get(url, headers=headers)
        #print("searching")
        #f = open("D:/yt",'w',encoding='utf-8')
        #f.write(str(resp.content))
        #f.close()
        soup = BeautifulSoup(resp.content, 'html.parser', from_encoding="utf8")
        #print(soup)



        search_results = soup.findAll("script")

        y = str(search_results)
        # pos = y.find(""""searchEndpoint":{"query""")

        # k=y[pos:pos+100]
        # sub2="""}},"searchInsteadFor"""
        # if_pos2=k.find(sub2)
        # pos_1=pos+27
        # pos_2= pos+ if_pos2 -1
        # #print("2sub" + str(if_pos2))

        # #pos_2 = y.find("""}},"searchInsteadFor""")
        # pos_1=pos+27

        # pos_mean = y.find('didYouMean":{"runs')
        # if(pos_mean!=-1):
        #     k = y[pos_mean:pos_mean+1800]

        #     sub = 'searchEndpoint":{"query'
        #     pos_end = pos_mean + k.find(sub) +26
        #     k=y[pos_end:pos_end+500]
        #     #print("k: " + k)
        #     sub='"'
        #     pos_end2 = pos_end + k.find(sub)



        #     ed_mean = y[pos_end:pos_end2]
        # else:
        #     ed_mean=""
        # ed =y [pos_1:pos_2]



        # #print(if_pos_2)
        # #print("ed:"+ ed)
        # #print("ed_mean:" +ed_mean)
        # #pos_2=str(y[pos_1:pos_2]).split('"')[3]

        # # = pos_2
        # #yes = y[pos_1-30:pos_2]

        # #print(yes)
        
        # if(if_pos2!= -1):
        #     #print("재검색: "+ ed)
        #     na = urllib.parse.quote(ed)
        #     url = "https://www.youtube.com/results?search_query=" + na
        #     resp = requests.get(url, headers=headers)
        #     soup = BeautifulSoup(resp.content, 'html.parser', from_encoding="utf8")
        #     search_results = soup.findAll("script")
        #     y = str(search_results)
        # elif(pos_mean != -1):    
        #     #print("did you mean 재검색: "+ ed_mean)
        #     na = urllib.parse.quote(ed_mean)
        #     url = "https://www.youtube.com/results?search_query=" + na
        #     resp = requests.get(url, headers=headers)
        #     soup = BeautifulSoup(resp.content, 'html.parser', from_encoding="utf8")
        #     search_results = soup.findAll("script")
        #     y = str(search_results)


        # pos = y.find("""{"contents":[{"videoRenderer""")
        # pos_3 = y.find('"maxOneLine":false}]}}],"trackingParams"')


        # pos_1=pos+26
        # k = y[pos_1:pos_1+200]
        # sub = '"'
        # pos_2 = pos-50 + k.find(sub)
        # y[:0]
        # id_jso = y[pos:pos_3+23]+'}'

        # jso = json.loads(id_jso, encoding='utf8', strict=False)
        # #f = open("C:/bin/f.txt", 'w', encoding='utf-8')
        # #f.write(str(id_jso))

        # vid = jso ['contents'] [0] ['videoRenderer'] ['videoId']
        pos = y.find('videoRenderer":{"')
        temp_split=y[pos:pos+300]
        vid=temp_split.split('"videoId":"')[1].split('"')[0]
        found_song=1
        #print(vid)

    except Exception as e:
        print(e)
        ffcount+=1
        print("찾지못함")
        if(ffcount>3): 
            return None
    if(found_song==1):

        #믹스, 음악이름, 가수 찾기 init
        playurl = "https://www.youtube.com/watch?v="+vid
        source = requests.get(playurl, headers=headers)
        soup = BeautifulSoup(source.content, 'html.parser', from_encoding="utf8")
        #search_results = soup.findAll("믹스")
        search_results = soup.findAll("script")
        y=str(search_results)

        sse=y
        #print(pos)
        #음악이름 찾기
        musicName=y.find('{"simpleText":"노래"}')
        #print(musicName)
        if(musicName != -1):
            tempname=y[musicName:musicName+150]
            #print("음악 이름을 검색합니다.")
            sub='[{"runs":[{"text"'
            if(tempname.find(sub) != -1):
                nPos1=musicName+50
                #print("이름 -1 아님")
            else:
                nPos1=musicName+47
                #print("이름 -1임")

            k=y[nPos1:nPos1+100]
            sub='"'
            nPos2=nPos1+ k.find(sub)

            #아티스트 찾기
            #if(y.find(''))
            musicArtist=y.find('simpleText":"아티스트"}')
            if(musicArtist !=-1):
                artPos1=musicArtist+10


                k=y[artPos1:artPos1+100]
                sub='"contents":[{"runs":[{"text"'
                if(k.find(sub) != -1):
                    #print("-1아님")
                    artPos1=musicArtist+50
                else:
                    #print("-1임")
                    artPos1=musicArtist+47

                k=y[artPos1:artPos1+100]
                sub='"'
                artPos2=artPos1+k.find(sub)
                #print(artPos1)
                #print(artPos2)

                mArt=y[artPos1:artPos2]
                if(r'\u' in mArt):
                    d= [i for i in range(len((mArt))) if mArt.startswith(r'\u', i)]
                    #print(d)
                    for cur_d in d:
                        temp_uni=mArt[cur_d:cur_d+6]
                        replace_uni=temp_uni.encode().decode('unicode-escape')
                        #print(temp_uni)
                        #print(replace_uni)
                        mArt = mArt.replace(temp_uni, replace_uni)
                #print("가수: " + mArt)
            mName=y[nPos1:nPos2]
            mNameTemp=y[nPos1:nPos2+300]
            mNameTemp=mNameTemp.split("아티스트")[0]

            if(r'\u' in mName):
                d= [i for i in range(len(mName)) if mName.startswith(r'\u', i)]
                #print(d)
                for cur_d in d:
                    temp_uni=mName[cur_d:cur_d+6]
                    replace_uni=temp_uni.encode().decode('unicode-escape')
                    #print(temp_uni)
                    #print(replace_uni)
                    mName = mName.replace(temp_uni, replace_uni)
            if(r'\u' in mName):
                mName=mName.encode().decode('unicode-escape')    
            
            #print("노래제목: " + mName) 

            if('{"webCommandMetadata":{"url":"' in mNameTemp):
                mvid=mNameTemp.split('{"webCommandMetadata":{"url":"')[1].split('"')[0]
                # print(mvid)
                mvid=mvid.split("?v=")[1]
                playurl = "https://www.youtube.com/watch?v="+mvid
                source = requests.get(playurl, headers=headers)
                soup = BeautifulSoup(source.content, 'html.parser', from_encoding="utf8")
                search_results = str(soup.findAll("script"))
                str1 = search_results.strip().split('var ytInitialData = ')[1].split(';</script>,')[0]
                y=str(str1)
                y1=str(search_results)
                if("LOGIN_REQUIRED" in y1):
                    print("성인인증 필요")
                    print("공식 노래url이 있으나 성인 인증이 필요합니다.")
                    gong=0
                elif("UNPLAYABLE" in y1):
                    print("재생 불가 노래")
                    gong=0
                else:
                    # print("성인인증 필요 없음")
                    #gong=1
                    #f=open("C:/bin/song_test.txt", 'w', encoding='utf-8')
                    #f.write(y)
                    #f.close()
                    
                    split1=y.split('{"contents":[{"videoPrimaryInfoRenderer":{"title":{"runs":[{"text":"')[1].split('"}')[0].lower().strip()
                    # print("split1" + split1)
                    #print(mvid)
                    list_par = []

                    import re
                    string=""
                    for ri in mName:

                        # 영어,숫자 및 공백 제거.

                        utext = re.sub('[^a-zA-Z0-9]',' ',ri).strip()

                        # 빈 리스트는 제거.
                        if(ri=='-'):
                            break
                        if(utext != ''):

                            string=string+utext
                        else:
                            string = string + " "
                    string=string.lower().strip()
                    # print(string)
                    mNameT=[]
                    #print(mName)
                    mNameT.append(mName.split("(")[0].lower().strip())
                    mNameT.append(mName.lower())
                    # print(mNameT)
                    # print(split1.find(mNameT[0]))
                    
                    if(split1.find(mNameT[0]) != -1 or split1.find(mNameT[1].split(" ")[0]) != -1  or split1.find(string) != -1):
                        
                        if('mv' in split1 or 'm/v' in split1 or 'official music video' in split1 or 'official video' in split1 or 'official audio' in split1):
                            gong=1
                            # print("공식 노래url로 재생합니다.(mv/official)")
                        elif('Provided to YouTube' in y):
                            gong=1  
                            #print("공식 노래url로 재생합니다.(auto generated by youtube)") 
                        else:
                            gong=0
                            #print("공식 노래url 제목에 포함되어있지 않음")
                    else:
                        #print("다른 노래입니다.")
                        gong=0
            else:
                mvid=""
                #print("공식 노래 url이 없습니다.")
                gong=0

        else:
            #print("노래정보가 없습니다.")
            gong=0
            musicName=-1
            musicArtist=-1

        
            gong=0
    #url=request.args.get("song")

    #ydl = YoutubeDL({"quiet": True})
    #ydl.params["format"] = 'bestaudio[ext=m4a]'


        #info = ydl.extract_info(
            #"https://www.youtube.com"+mvid, process=False)#download=False)
    if(gong==0):
        #print(vid)
        #print("공식X")

        return vid
    elif(gong==1):
        #print(mvid)
        #print("공식O")

        return mvid
