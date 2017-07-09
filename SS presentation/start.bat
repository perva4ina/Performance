del log.log
rd report-output /s /q
cd apache-jmeter-3.1\bin
call jmeter -n -t "..\..\create_patients.jmx" -l "..\..\log.log" -e -o "..\..\report-output"

