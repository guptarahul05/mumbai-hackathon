from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PIL import Image


import os
# .....
# ..... some exta code unimportant for this issue....
# ....


# here it is
def convert_txt_pdf(fileName):
        filePath="/home/tejas/Desktop/website/"+fileName
	ptr = open(filePath, "r")  # text file I need to convert
	lineas = ptr.readlines()
	ptr.close()
	i = 750
	numeroLinea = 0
	base=os.path.basename(fileName)
	pdffileName=os.path.splitext(base)[0]
	pdffileName=pdffileName+".pdf"
        pdffileName="/home/tejas/Desktop/website/"+pdffileName
	c=canvas.Canvas(pdffileName)

	while numeroLinea < len(lineas):
	    if numeroLinea - len(lineas) < 60: # I'm gonna write every 60 lines because I need it like that
		i=750
		for linea in lineas[numeroLinea:numeroLinea+60]:      
		    c.drawString(15, i, linea.strip())
		    numeroLinea += 1
		    i -= 12
		c.showPage()
		c.save()
	    else:
		i = 750
		for linea in lineas[numeroLinea:]:
		   c.drawString(15, i, linea.strip())
		   numeroLinea += 1
		   i -= 12
		c.showPage()
		c.save()
		
	return pdffileName
		
