# TODO - this is a draft 

# SEE - http://www.mbtest.org/docs/commandLine ( Saving mountebank configuration )
# SEE ALSO: ../test/fixture/mb-setup-imposters.sh

# usage: 
#   cd script
#   ./mbstart.sh 

# configuration saved with command: 
#   cd script
#   mb save --port 2525 --savefile saved.json --removeProxies
 
mb restart --port 2525 --configfile ./saved.json 