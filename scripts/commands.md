## Convert h5 model into json model
```
tensorflowjs_converter --input_format=keras ./model.h5 ./model_tfjs

tensorflowjs_converter --input_format=tf_saved_model model/ ./model_tfjs

tensorflowjs_converter --input_format=tf_saved_model --output_format=tfjs_graph_model model/ ./model_tfjs
```
