from flask import Flask,request,jsonify,render_template
import subprocess
#import sys
#sys.path.insert(0,'/whoise')

from subprocess import call
import convert

app=Flask(__name__)
 
@app.route('/whoiss',methods=['POST'])
def whoiss():
	req_data=request.get_json()
	targetUrl=req_data['url']
	result=whoisData.whois_cal(targetUrl)
	return jsonify(result)

@app.route('/xss_check',methods=['POST'])
def xsss():
	req_data=request.get_json()
	targetUrl=req_data['url']
	#f=open("xssReport.txt","w")
	fileName=req_data['filename']
	fileName=fileName+".txt"
	with open(fileName,'w') as f:
		subprocess.call(["python","xsssnipertest.py","-u",targetUrl],stdout=f)
	convert.convert_txt_pdf(fileName)
	return 'Your file is ready to Download'
		
@app.route('/payload',methods=['POST'])
def payLoad():
	req_data=request.get_json()
	platform=req_data['platform']
	payloadType=req_data['payloadType']
	callType=req_data['callType']
	lHost=req_data['lhost']
	lPort=req_data['lport']
	payloadName=req_data['name']
	if platform=='windows':
		payloadName=payloadName+".exe"
	elif platform=='android':
		payloadName=payloadName+".apk"
	elif platform=='php':
		payloadName=payloadName+".php"
	payloadDetail=platform+"/"+payloadType+"/"+callType
	with open(payloadName,'w') as f:
		subprocess.call(['msfvenom',"-p",payloadDetail,'LHOST',lHost,'LPORT',lPort],stdout=f)
	return 'Your file is ready to be downloaded'
	

@app.route('/testssl',methods=['POST'])
def testSsl():
	req_data=request.get_json()
	testUrl=req_data['url']
	fileName=req_data['filename']
	fileName=fileName+".txt"
	with open(fileName,'w') as f:
		subprocess.call(["./testssl.sh","-U",testUrl],stdout=f)
	convert.convert_txt_pdf(fileName)
	return 'Your file is ready to be downloaded'	
 	
if __name__ == '__main__':
	app.run()
 	
