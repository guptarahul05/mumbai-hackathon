
import subprocess
from subprocess import call
import convert
import os

def xss_inter(targetUrl,fileName):
	fileName=fileName+".txt"
        filePath="/home/tejas/Desktop/website/"+fileName
	with open(filePath,'w') as f:
		subprocess.call(["python","/home/tejas/Desktop/website/xss/xsssnipertest.py","-u",targetUrl],stdout=f)
        f.close()
        pdffileName=convert.convert_txt_pdf(fileName)
        pdffileName=pdffileName.replace("/home/tejas/Desktop/website/","")
        path_from_pdf="/home/tejas/Desktop/website/"+pdffileName
	path_to_pdf="/home/tejas/Desktop/website/static/reports/xss/"+pdffileName
        #path_to_txt="home/ubuntu/website/reports/xss/"+fileName
	subprocess.call(["mv",path_from_pdf,path_to_pdf])
	#path_from_txt="/home/ubuntu/website/"+fileName
	#subprocess.call(["mv",path_from_txt,path_to_txt])
        os.remove(filePath)


