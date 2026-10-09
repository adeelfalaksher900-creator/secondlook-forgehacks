from pathlib import Path
import subprocess,json
root=Path(__file__).resolve().parent.parent
sections=[(0,8,0,24),(8,31,24,41),(31,45,41,56),(45,60,56,71),(60,78,71,82),(78,98,82,92),(98,112,92,101),(112,127,101,113),(127,145,113,141),(145,153,141,154),(153,160,154,160)]
work=root/'media/narrated-segments';work.mkdir(exist_ok=True)
for i,(a,b,c,d) in enumerate(sections):
 out=work/f'{i:02}.mp4'
 subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-ss',str(a),'-t',str(b-a),'-i',str(root/'media/SecondLook_Visual_Demo_1080p.mp4'),'-an','-vf',f'setpts=(PTS-STARTPTS)*{(d-c)/(b-a):.9f},fps=30,tpad=stop_mode=clone:stop_duration=0.2','-t',str(d-c),'-c:v','libx264','-threads','2','-preset','veryfast','-crf','23','-g','30','-pix_fmt','yuv420p',str(out)],check=True)
 print('Timed section',i,flush=True)
listing=work/'concat.txt';listing.write_text(''.join(f"file '{i:02}.mp4'\n" for i in range(len(sections))))
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',str(listing),'-i',str(root/'media/SecondLook_Narration.mp3'),'-map','0:v','-map','1:a','-c:v','copy','-af','loudnorm=I=-16:TP=-1.5:LRA=11,apad=whole_dur=160,atrim=duration=160','-c:a','aac','-b:a','160k','-movflags','+faststart','-t','160',str(root/'media/SecondLook_Narrated_Demo_1080p.mp4')],check=True)
(root/'docs/narration-sync.json').write_text(json.dumps({'provider':'vidIQ voiceover','voice':'Liam - Energetic, Social Media Creator','voice_id':'TX3LPaxmHKxFdv7VOQHJ','source_audio_seconds':157.23102040816326,'output_seconds':160,'fps':30,'method':'Continuous original HyperFrames frames retimed by section to narration paragraph boundaries; no slide replacement. AAC narration normalized to -16 LUFS target.','sections':[{'video_source':[a,b],'output':[c,d]} for a,b,c,d in sections]},indent=2)+'\n')
print('Created narrated 1080p demo')
