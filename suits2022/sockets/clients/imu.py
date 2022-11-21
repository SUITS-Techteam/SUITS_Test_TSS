import time, sys
import math
import json
import board
from adafruit_lsm6ds.lsm6dsox import LSM6DSOX as LSM6DS
from adafruit_lis3mdl import LIS3MDL

i2c = board.I2C()  # uses board.SCL and board.SDA
accel_gyro = LSM6DS(i2c)
mag = LIS3MDL(i2c)

debug = False

while True:
    acceleration = accel_gyro.acceleration
    acc_x, acc_y, acc_z = acceleration
    gyro = accel_gyro.gyro
    gyro_x, gyro_y, gyro_z = gyro
    magnetic = mag.magnetic
    mag_x, mag_y, mag_z = magnetic

    heading = (math.atan(mag_y/mag_x) * -100)

    if (heading < 0):
        heading = heading + 360

    imuData = {'id':'IMU',
			   'heading':'{0:3.2f}'.format(heading),
			   'accel_x':'{0:3.2f}'.format(acc_x),
			   'accel_y':'{0:3.2f}'.format(acc_y),
			   'accel_z':'{0:3.2f}'.format(acc_z),
			   'gyro_x':'{0:3.2f}'.format(gyro_x),
			   'gyro_y':'{0:3.2f}'.format(gyro_y),
			   'gyro_z':'{0:3.2f}'.format(gyro_z),
			   'mag_x':'{0:3.2f}'.format(mag_x),
			   'mag_y':'{0:3.2f}'.format(mag_y),
			   'mag_z':'{0:3.2f}'.format(mag_z)}

    print(json.dumps(imuData))

	if debug:
		print(heading)
		print("Acceleration: X:{0:7.2f}, Y:{1:7.2f}, Z:{2:7.2f} m/s^2".format(*acceleration))
		print("Gyro:          X:{0:7.2f}, Y:{1:7.2f}, Z:{2:7.2f} rad/s".format(*gyro))
		print("Magnetic:      X:{0:7.2f}, Y:{1:7.2f}, Z:{2:7.2f} uT".format(*magnetic))
		print("")

    sys.stdout.flush() #Flushing STDOUT to get consistent data flow
    time.sleep(0.5)
