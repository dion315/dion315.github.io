<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://fonts.googleapis.com/css?family=Raleway&display=swap" rel="stylesheet">
    <title>Christopher Dion</title>
    <link href="https://fonts.googleapis.com/css?family=Raleway:300,400&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
        integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous" />
    <style>
        body {
            margin: 40px auto;
            max-width: 650px;
            line-height: 1.6;
            font-size: 18px;
            color: #444;
            padding: 0 10px;
            background: #eeeeee;
            text-align: right;
            font-family: "Raleway", sans-serif;
        }
    
        h1,
        h2,
        h3 {
            line-height: 1.2;
        }
    
        h1 {
            font-weight: 400;
        }
    
        p,
        label {
            font-weight: 300;
        }
    </style>
    </head>
    
    <body>
        <h1>Hi, I'm Christopher! I love to code!</h1>
        <p>
            You can reach out to me <a href="mailto:dion315@gmail.com">here</a> or
            fill out the form below...
        </p>
        <form action="https://mailthis.to/dion315@gmail.com" method="POST">
            <div class="form-group">
                <label>Name:</label>
                <input type="text" class="form-control" name="Name" />
            </div>
            <div class="form-group">
                <label>Your Email:</label>
                <input type="email" class="form-control" name="_replyto" required />
            </div>
            <div class="form-group">
                <label>Message:</label>
                <textarea class="form-control" name="Message" rows="3"></textarea>
            </div>
            <input type="hidden" name="_honeypot" value="" /> <!-- the beauty of this is
            that it will work with the service to not allow a submittal that has
            anything in the honeypot! -->
            <button type="submit" class="btn btn-primary">Send</button>
        </form>
    </body>
    
    </html>

</head>
<body>
    
</body>
</html>
