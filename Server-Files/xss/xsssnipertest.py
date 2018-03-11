#!/usr/bin/env python

import os
from optparse import OptionParser
from core.target import Target
from core.engine import Engine
from core.packages.clint.textui import colored 
from core.cli import success, warning, error


def main():
    usage = "usage: %prog [options]"
    parser = OptionParser(usage=usage)
    parser.add_option("-u", "--url", dest="url", help="target URL")
   
    
    (options, args) = parser.parse_args()
    #options.url=targetUrl
    if options.url is None: 
        parser.print_help() 
        exit()
    
    
    t = Target(options.url)
    s = Engine(t)
    s.addOption("crawl", True)
    s.addOption("forms", True)
    s.addOption("threads", 1)
    if s.start():
        exit()
        
if __name__ == '__main__':
    main()
    
