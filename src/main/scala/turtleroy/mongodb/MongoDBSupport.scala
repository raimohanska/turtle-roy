package turtleroy.mongodb

import com.mongodb.casbah.{Imports, MongoURI}
import com.mongodb.casbah.commons.{Imports => CommonsImports}
import com.mongodb.casbah.query.{Imports => QueryImports}
import com.mongodb.ServerAddress
import turtleroy.Turtle

trait TurtleStorage {
  def storeTurtle(turtle: Turtle)
  def findTurtle(id: String): Option[Turtle]
}

class MongoStorage extends TurtleStorage with MongoDBSupport {
  def initMongo = {
    val uri = Option.apply(java.lang.System.getenv("MONGOHQ_URL"))
    uri match {
      case Some(uri) => {
        val mongoURI = MongoURI(uri);
        val db = mongoURI.connectDB;
        db.authenticate(mongoURI.username, new String(mongoURI.password))
        db
      }
      case None => {
        val server = new ServerAddress("localhost")
        MongoConnection(server)("turtleroy")
      }
    }

  }
  lazy val mongoDB = initMongo
  protected def turtleCollection = mongoDB("turtle")
  def findTurtle(id: String) = turtleCollection.findOne(MongoDBObject("id" -> id)).map(toObject[Turtle])
  def storeTurtle(turtle: Turtle) = turtleCollection.findAndModify(
    MongoDBObject("id" -> turtle.id), null, null, false, toDBObject(turtle), true, true).map(toObject[Turtle])
}

trait MongoDBSupport extends Imports with CommonsImports with QueryImports {
  import com.novus.salat._
  implicit val ctx = new Context {
    val name = "CustomContext"
    override val typeHintStrategy = StringTypeHintStrategy(TypeHintFrequency.WhenNecessary)
  }
  def toObject[A <: CaseClass](dbObject: DBObject)(implicit m: Manifest[A]) = grater[A].asObject(dbObject)
  def toDBObject[A <: CaseClass](a: A)(implicit m: Manifest[A]) = grater[A].asDBObject(a)
}
