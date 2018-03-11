

import subprocess
from subprocess import call
import convert
import os

def ssl_inter(testUrl,fileName):
	fileName=fileName+".txt"
        filePath="/home/tejas/Desktop/website/"+fileName
	with open(filePath,'w') as f:
		subprocess.call(["/home/tejas/Desktop/website/testssl/testssl.sh","-U",testUrl],stdout=f)
	pdffileName=convert.convert_txt_pdf(fileName)
	#path_from_pdf="/home/ubuntu/website/"+pdffileName
        pdffileName=pdffileName.replace("/home/tejas/Desktop/website/","")
        path_from_pdf="/home/tejas/Desktop/website/"+pdffileName
        path_to_pdf="/home/tejas/Desktop/website/static/reports/ssl/"+pdffileName
	subprocess.call(["mv",path_from_pdf,path_to_pdf])
	#path_txt="/home/ubuntu/website/"+fileName
	os.remove(filePath)
