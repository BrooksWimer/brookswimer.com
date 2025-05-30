from flask import Flask
from flask_cors import CORS
from flask_talisman import Talisman
from .config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    Talisman(app)
    CORS(app, resources={r"/*": {"origins": "https://brookswimer.com"}})
    
    # Register blueprints
    from .routes.main import main_bp
    from .routes.store_routes import store_bp
    from .routes.order_routes import order_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(store_bp)
    app.register_blueprint(order_bp)
    
    return app 