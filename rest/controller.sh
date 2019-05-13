#!/bin/bash
# daemonise infinite bash scripts
# based on http://www.linux.com/learn/tutorials/442412-managing-linux-daemons-with-init-scripts

CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SCRIPT_NAME=$1

if [ -z "$SCRIPT_NAME" ]
then
	echo 'Script name not specified'
	exit 1
fi

SCRIPT_PATH=${CURRENT_DIR}/${SCRIPT_NAME}
PID_DIR=${CURRENT_DIR}
PID_PATH=${PID_DIR}/${SCRIPT_NAME}.pid

if [ ! -x "$SCRIPT_PATH" ]
then
	echo 'Script not exist or not executable'
	echo $SCRIPT_PATH
	exit 1
fi

if [ ! -d "$PID_DIR" ]
then
	echo 'PID dir not exists'
	echo $PID_DIR
	exit 1
fi

if [ ! -w "$PID_DIR" ]
then
	echo 'PID dir not writable'
	echo $PID_DIR
	exit 1
fi

checkpid(){
    if [ -f $PID_PATH ]; then
        PID=`cat $PID_PATH`
        PIDCMD=`ps -p $PID -o command=`
        echo $SCRIPT_PATH
        echo $PIDCMD
        if [[ "$PIDCMD" =~ "$SCRIPT_PATH" ]]; then
            echo "PID OK"
        else
            echo "PID NOT OK, deleting"
            rm "$PID_PATH"
        fi
    fi
}

start() {
        echo -n "Starting ... "
        if [ -f $PID_PATH ]; then
                PID=`cat $PID_PATH`
                echo $SCRIPT_NAME already running: $PID
                exit 2;
        else
                $SCRIPT_PATH &
                PID=$!
				echo $PID > $PID_PATH
				echo OK. PID: $PID
                return 0
        fi

}

stop() {
        echo -n "Shutting down ... "
        if [ -f $PID_PATH ]; then
                PID=`cat $PID_PATH`
                kill $PID
                rm $PID_PATH
                echo "OK"

        else
                echo "Script not running"
                return 0
        fi
}

status() {
	if [ -f $PID_PATH ]; then
			PID=`cat $PID_PATH`
			echo PID: $PID
			ps -p $PID
	else
			echo 'Not running'
	fi
}

case "$2" in
    start)
        checkpid
        start
        ;;
    stop)
        checkpid
        stop
        ;;
    status)
        checkpid
        status
        ;;
    restart)
        stop
        start
        ;;
    *)
        echo "Usage: SCRIPT_NAME {start|stop|status|restart}"
        echo "Example: some_script.sh start"
        exit 1
        ;;
esac
exit $?