import simplejson
import numpy as np
from Constants import Const
import datetime

def iterable(obj):
    try:
        iter(obj)
    except Exception:
        return False
    else:
        return True
  
def minmax_scale(matrix):
    m = matrix - matrix.min()
    return m/m.max()

def normalize(matrix):
    m = matrix - matrix.mean(axis=0)
    return m/(matrix.std(axis=0) + .00001)


def root_kernel(matrix):
    matrix = matrix/(matrix.sum(axis = 1) + .000001).reshape(-1,1)
    return np.sqrt(matrix)

def jsonify_np_dict(d):
    def numpy_converter(obj):
        #converts stuff to vanilla python  for json since it gives an error with np.int64 and arrays
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.float):
            return round(float(obj),5)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, datetime.datetime):
            return obj.__str__()
        return obj
    return simplejson.dumps(d,default=numpy_converter)

def np_converter(obj):
    #converts stuff to vanilla python  for json since it gives an error with np.int64 and arrays
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.float):
        return round(float(obj),5)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, datetime.datetime) or isinstance(obj, datetime.time):
        return obj.__str__()
    print('np_converter cant encode obj of type', obj,type(obj))
    return obj
    
def np_dict_to_json(d,destination_file, nan_to_null = False):   
    try:
        with open(destination_file, 'w') as f:
            #nan_to_null makes it save it as null in the json instead of NaN
            #more useful when it's sent to a json but will be read back in python as None
            simplejson.dump(d,f,default = np_converter, ignore_nan = nan_to_null)
        return True
    except Exception as e:
        print(e)
        return False
   
def load_organ_centroids():
    with open(Const.data_dir + 'organ_centroid.json','r') as f:
        test = simplejson.load(f)
    return test